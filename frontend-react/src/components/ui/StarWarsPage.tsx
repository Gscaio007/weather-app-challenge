import { useState, useEffect } from 'react'; 


interface PersonData {
    id: string;
    name: string;
    gender: string;
    filmsCount: number;
}

interface PersonDetails {
    name: string;
    height: string;
    mass: string;
    hair_color: string;
    skin_color: string;
    eye_color: string;
    birth_year: string;
    gender: string;
    films: number;
    vehicles: number;
}

const styles = {
    container: { padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' },
    list: { listStyle: 'none', padding: 0 },
    listItem: { border: '1px solid #ddd', margin: '10px 0', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    button: { padding: '8px 15px', cursor: 'pointer', backgroundColor: '#333', color: 'white', border: 'none', marginLeft: '5px' },
    detailBox: { border: '2px solid gold', padding: '20px', marginTop: '20px', backgroundColor: '#111', color: 'white' }
};

const BASE_URL = 'http://localhost:3000/starwars/people';

function StarWarsPage() {
    // Definindo os tipos para os estados
    const [people, setPeople] = useState<PersonData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [nextPage, setNextPage] = useState<number | null>(null);
    const [prevPage, setPrevPage] = useState<number | null>(null);
    // const [selectedPerson, setSelectedPerson] = useState<string | null>(null); // Removido para evitar TS6133
    const [details, setDetails] = useState<PersonDetails | null>(null);

    // 1. Fetch da lista de personagens
    useEffect(() => {
        setLoading(true);
        // setSelectedPerson(null);
        setDetails(null);
        
        fetch(`${BASE_URL}?page=${currentPage}`)
            .then(res => res.json())
            .then(data => {
                setPeople(data.results);
                setNextPage(data.next ? parseInt(data.next) : null);
                setPrevPage(data.previous ? parseInt(data.previous) : null);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erro ao buscar SWAPI:", err);
                setLoading(false);
                alert("Erro ao carregar lista de personagens.");
            });
    }, [currentPage]);

    // 2. Fetch dos detalhes do personagem
    const fetchDetails = (id: string) => {
        // setSelectedPerson(id);
        setDetails(null); 
        
        fetch(`http://localhost:3000/starwars/people/${id}`)
            .then(res => res.json())
            .then(data => {
                setDetails(data);
            })
            .catch(err => {
                console.error("Erro ao buscar detalhes:", err);
                alert("Erro ao carregar detalhes do personagem.");
            });
    };

    return (
        <div style={styles.container}>
            <h1>🌌 Star Wars Characters - POC (API Externa)</h1>
            
            {loading ? (
                <p>Carregando dados da galáxia...</p>
            ) : (
                <>
                    <ul style={styles.list}>
                        {people.map(person => (
                            <li key={person.id} style={styles.listItem}>
                                <span>
                                    <strong>{person.name}</strong> ({person.gender})
                                </span>
                                <button 
                                    style={styles.button}
                                    onClick={() => fetchDetails(person.id)}
                                >
                                    Ver Detalhes
                                </button>
                            </li>
                        ))}
                    </ul>

                    {/* Controles de Paginação */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                        <button 
                            style={styles.button}
                            onClick={() => prevPage && setCurrentPage(prevPage)}
                            disabled={!prevPage}
                        >
                            Página Anterior
                        </button>
                        <button 
                            style={styles.button}
                            onClick={() => nextPage && setCurrentPage(nextPage)}
                            disabled={!nextPage}
                        >
                            Próxima Página
                        </button>
                    </div>
                </>
            )}

            {/* Visualização de Detalhes */}
            {details && (
                <div style={styles.detailBox}>
                    <h2>Detalhes de {details.name}</h2>
                    <p>Altura: {details.height} cm | Massa: {details.mass} kg</p>
                    <p>Cor dos Olhos: {details.eye_color} | Cor do Cabelo: {details.hair_color}</p>
                    <p>Ano de Nascimento: {details.birth_year}</p>
                    <p>Apareceu em: {details.films} filmes | Veículos: {details.vehicles}</p>
                </div>
            )}
        </div>
    );
}

export default StarWarsPage;