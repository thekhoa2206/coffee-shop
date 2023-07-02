FROM eclipse-temurin:11

LABEL mentainer="Coffee-shop"

WORKDIR /app

#RUN mvn clean package

COPY target/coffeeshop-0.0.1-SNAPSHOT.jar /app/coffeeshop.jar

ENTRYPOINT ["java", "-jar", "coffeeshop.jar"]

#Build java mvn clean package