package trading.bootcamp.project.config;

import org.springframework.context.annotation.Configuration;

@Configuration
public class ElasticsearchConfig {

    /*@Bean(destroyMethod = "close")
    public RestClient elasticsearchClient() {
        return RestClient.builder(new HttpHost("localhost", 9200, "http")).build();
    }*/
}
