# Étape 1 : Builder le projet
FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Étape 2 : Lancer l'application Spring Boot
FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY --from=build /app/target/api-gateway-*.jar api-gateway.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "api-gateway.jar"]
