# Step 1: Build the application
FROM rust:latest AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the entire project into the container
COPY . .

# Install dependencies and build the app
RUN apt-get update && apt-get install -y libssl-dev
RUN cargo build --release

# Step 2: Set up the final image for production
FROM debian:bullseye-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the compiled binary from the builder stage
COPY --from=builder /app/target/release/actix-web-app .

# Run the application
CMD ["./actix-web-app"]

