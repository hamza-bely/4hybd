# For api-gateway
FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY target/api-gateway-*.jar /app/api-gateway.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "api-gateway.jar"]