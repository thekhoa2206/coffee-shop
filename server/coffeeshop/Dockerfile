
FROM maven:3.6.0-jdk-11-slim AS build
COPY src /home/app/src
COPY pom.xml /home/app
RUN mvn -f /home/app/pom.xml clean package


FROM eclipse-temurin:11

LABEL mentainer="Coffee-shop"

WORKDIR /app

COPY --from=build /home/app/target/coffeeshop-0.0.1-SNAPSHOT.jar /app/coffeeshop.jar

ENTRYPOINT ["java", "-jar", "coffeeshop.jar"]

#Build java mvn clean package