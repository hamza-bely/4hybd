# Étape 1 : Builder l’application
FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Étape 2 : Image pour exécuter l’application
FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY --from=build /app/target/user-service-*.jar user-service.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "user-service.jar"]
