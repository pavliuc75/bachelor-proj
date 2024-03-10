# Getting Started

# Local Development

1. Create env.properties file on path back-end-bloom/src/main/resources:
- Note: Value for bellow parameters can be found in the Gitlab project CI/CD variables(required Maintainer access)

```bash
echo "MONGO_DB_URL=CHANGE-ME
DATABASE_NAME=CHANGE-ME
KEYCLOAK_REALM=CHANGE-ME
KEYCLOAK_RESOURCE=CHANGE-ME
KEYCLOAK_AUTHSERVERURL=CHANGE-ME
KEYCLOAK_CREDENTIALS_SECRET=CHANGE-ME
" > back-end-bloom/src/main/resources/env.properties
```

2. Start stripe listener(for accepting payments):

```bash
 cd stripe-listener/
 ./stripe listen --forward-to localhost:8080/webhook
```
- Note: change port number to the one you are using for the back-end

3. Set global env variable GOOGLE_APPLICATION_CREDENTIALS to the path of the service account key file. 
<or>
You can do that in the IDE by going to Run -> Edit Configurations -> Environment Variables -> Add -> GOOGLE_APPLICATION_CREDENTIALS -> path to the service account key file

## Testing

### Reference Documentation
For further reference, please consider the following sections:

* [Official Apache Maven documentation](https://maven.apache.org/guides/index.html)
* [Spring Boot Maven Plugin Reference Guide](https://docs.spring.io/spring-boot/docs/2.7.3/maven-plugin/reference/html/)
* [Create an OCI image](https://docs.spring.io/spring-boot/docs/2.7.3/maven-plugin/reference/html/#build-image)
* [Spring Data JPA](https://docs.spring.io/spring-boot/docs/2.7.3/reference/htmlsingle/#data.sql.jpa-and-spring-data)

### Guides
The following guides illustrate how to use some features concretely:

* [Accessing Data with JPA](https://spring.io/guides/gs/accessing-data-jpa/)

