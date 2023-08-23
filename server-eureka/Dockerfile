FROM maven:3.8.3-openjdk-17 AS build
COPY src /home/app/src
COPY pom.xml /home/app
RUN mvn -f /home/app/pom.xml clean package


FROM openjdk:17-oracle

LABEL mentainer="server-eureka"

WORKDIR /app

COPY --from=build /home/app/target/server-eureka.jar /app/server-eureka.jar

ENTRYPOINT ["java", "-jar", "server-eureka.jar"]