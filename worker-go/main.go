package main

import (
	"context"
	"encoding/json"
	"log"
	"os"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type WeatherData struct {
	City        string  `json:"city" bson:"city"`
	Country     string  `json:"country" bson:"country"`
	Timestamp   int64   `json:"timestamp" bson:"timestamp"`
	Temperature float64 `json:"temperature" bson:"temperature"`
	Humidity    int64   `json:"humidity" bson:"humidity"`
	WindSpeed   float64 `json:"wind_speed" bson:"wind_speed"`
	Description string  `json:"description" bson:"description"`
}

var mongoClient *mongo.Client

func failOnError(err error, msg string) {
	if err != nil {

		log.Fatalf("%s: %s", msg, err)
	}
}

func connectMongoDB(uri string) *mongo.Client {
	maxRetries := 15

	for i := 0; i < maxRetries; i++ {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))

		if err == nil {

			err = client.Ping(ctx, nil)
			if err == nil {
				cancel()
				log.Println(" Conexão MongoDB estabelecida com sucesso!")
				return client
			}
		}

		cancel()
		log.Printf(" Falha na conexão MongoDB. Tentativa %d/%d. Erro: %s. Aguardando 3 segundos...", i+1, maxRetries, err)
		time.Sleep(3 * time.Second)
	}

	log.Fatal("Falha final ao conectar ao MongoDB após várias tentativas.")
	return nil
}

func connectRabbitMQ(amqpURI string) *amqp.Connection {
	maxRetries := 10

	for i := 0; i < maxRetries; i++ {
		conn, err := amqp.Dial(amqpURI)
		if err == nil {
			log.Println("Conexão RabbitMQ estabelecida com sucesso!")
			return conn
		}
		log.Printf("Falha na conexão RabbitMQ. Tentativa %d/%d. Erro: %s. Aguardando 5 segundos...", i+1, maxRetries, err)
		time.Sleep(5 * time.Second)
	}

	// Se o loop terminar sem sucesso
	log.Fatal("Falha final ao conectar ao RabbitMQ após várias tentativas.")
	return nil
}

func main() {

	rabbitmqHost := os.Getenv("RABBITMQ_HOST")
	rabbitmqUser := os.Getenv("RABBITMQ_USER")
	rabbitmqPass := os.Getenv("RABBITMQ_PASS")

	mongoURI := os.Getenv("MONGO_URI")
	if mongoURI == "" {

		mongoURI = "mongodb://weather_mongodb:27017/weather_db"
	}

	amqpURI := "amqp://" + rabbitmqUser + ":" + rabbitmqPass + "@" + rabbitmqHost + ":5672/"

	log.Printf("Iniciando Worker Go...")
	log.Printf("Mongo URI: %s", mongoURI)
	log.Printf("RabbitMQ Host: %s", rabbitmqHost)

	mongoClient = connectMongoDB(mongoURI)
	defer func() {
		if err := mongoClient.Disconnect(context.Background()); err != nil {
			log.Printf("Erro ao desconectar do MongoDB: %v", err)
		}
	}()

	collection := mongoClient.Database("weather_db").Collection("weather_data")

	conn := connectRabbitMQ(amqpURI)
	defer conn.Close()

	ch, err := conn.Channel()
	failOnError(err, " Falha ao abrir um canal")
	defer ch.Close()

	q, err := ch.QueueDeclare(
		"weather_queue",
		true,
		false,
		false,
		false,
		nil,
	)
	failOnError(err, " Falha ao declarar a fila")
	log.Printf("Fila '%s' declarada. Esperando por mensagens...", q.Name)

	msgs, err := ch.Consume(
		q.Name,
		"",
		true,
		false,
		false,
		false,
		nil,
	)
	failOnError(err, " Falha ao registrar o consumidor")

	forever := make(chan bool)

	go func() {
		for d := range msgs {
			log.Printf(" Mensagem recebida: %s", d.Body)

			var data WeatherData
			err := json.Unmarshal(d.Body, &data)
			if err != nil {
				log.Printf(" Erro ao deserializar JSON: %v. Descartando mensagem.", err)
				continue
			}

			ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
			_, insertErr := collection.InsertOne(ctx, data)
			cancel()

			if insertErr != nil {
				log.Printf(" Erro ao salvar no MongoDB: %v", insertErr)
			} else {
				log.Printf("   ->  Dados do clima de %s salvos no MongoDB.", data.City)
			}
		}
	}()

	log.Println(" [*] Worker Go iniciado. Pressione CTRL+C para sair.")
	<-forever
}
