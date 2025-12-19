# Stage 1: Build a Go application
FROM golang:1.21-alpine AS builder

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy go mod and sum files
COPY go.mod .
COPY go.sum .

# Download all dependencies
RUN go mod download

# Copy the source code
COPY . .

# Build the Go application
# Assumes your main package is in main.go or similar structure
RUN go build -o main .

# Stage 2: Final clean image
FROM alpine:latest

# Set the Current Working Directory inside the container
WORKDIR /root/

# Copy the built executable from the builder stage
COPY --from=builder /app/main .

# Command to run the executable
# Replace 'main' with the actual name of your executable if different
CMD ["./main"]