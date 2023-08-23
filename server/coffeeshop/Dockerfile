FROM maven:3.8.3-openjdk-17 AS build
COPY src /home/app/src
COPY pom.xml /home/app
RUN mvn -f /home/app/pom.xml clean package


FROM openjdk:17-oracle

LABEL mentainer="core-service"

WORKDIR /app

COPY --from=build /home/app/target/core-service.jar /app/core-service.jar

ENTRYPOINT ["java", "-jar", "core-service.jar"]