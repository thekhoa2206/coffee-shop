FROM maven:3.8.3-openjdk-17 AS build
COPY src /home/app/src
COPY pom.xml /home/app
RUN mvn -f /home/app/pom.xml clean package


FROM openjdk:17-oracle

LABEL mentainer="order-service"

WORKDIR /app

COPY --from=build /home/app/target/order-service.jar /app/order-service.jar

ENTRYPOINT ["java", "-jar", "order-service.jar"]