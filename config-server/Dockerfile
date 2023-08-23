FROM maven:3.8.3-openjdk-17 AS build
COPY src /home/app/src
COPY pom.xml /home/app
RUN mvn -f /home/app/pom.xml clean package


FROM openjdk:17-oracle

LABEL mentainer="config-server"

WORKDIR /app

COPY --from=build /home/app/target/config-server.jar /app/config-server.jar

ENTRYPOINT ["java", "-jar", "config-server.jar"]