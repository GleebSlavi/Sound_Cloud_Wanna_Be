package trading.bootcamp.project.config;

import org.apache.http.HttpHost;
import org.apache.http.client.methods.HttpPost;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestClientBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ElasticsearchConfig {

    /*@Bean(destroyMethod = "close")
    public RestClient elasticsearchClient() {
        return RestClient.builder(new HttpHost("localhost", 9200, "http")).build();
    }*/
}
