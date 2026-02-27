package com.ecommerce.forum.config;

import com.ecommerce.forum.model.Discussion;
import com.ecommerce.forum.repository.DiscussionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner init(DiscussionRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                createSampleDiscussion(repository, "Comment vérifier l'authenticité d'un vendeur?", "achats-ventes", "Sophie M.", "pinned", 0, 0);
                createSampleDiscussion(repository, "Retours gratuits: comment ça marche?", "livraison", "Lucas D.", null, 6, 25);
                createSampleDiscussion(repository, "Paiement par carte: délai de remboursement?", "paiements", "Amira K.", null, 0, 5);
                createSampleDiscussion(repository, "Livraison express disponible en Tunisie?", "livraison", "Thomas R.", null, 0, 80);
                createSampleDiscussion(repository, "Escroquerie: comment signaler un vendeur?", "securite", "Léa P.", null, 2, 10);
            }
        };
    }

    private void createSampleDiscussion(DiscussionRepository repo, String title, String category, String author, String badge, int comments, int views) {
        Discussion d = new Discussion();
        d.setTitle(title);
        d.setContent("Contenu de démonstration pour: " + title);
        d.setCategoryId(category);
        d.setAuthorId("1");
        d.setAuthorName(author);
        d.setBadge(badge);
        d.setComments(comments);
        d.setViews(views);
        repo.save(d);
    }
}
