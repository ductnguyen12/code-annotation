# syntax=docker/dockerfile:1

FROM amazoncorretto:17-alpine3.17-jdk as base
WORKDIR /app
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline
COPY src ./src

FROM base as development
CMD ["./mvnw", "compile", "spring-boot:run"]

FROM base as build
RUN ./mvnw -DskipTests package

FROM amazoncorretto:17-alpine3.17 as production
EXPOSE 8080
COPY --from=build /app/target/code-annotation-*.jar /code-annotation.jar
CMD ["java", "-jar", "/code-annotation.jar"]