package com.ecommerce.forum.service;

import com.ecommerce.forum.model.Discussion;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;

@Service
public class ForumService {

    private static final int NEW_HOURS = 48;
    private static final int HOT_DAYS = 7;
    private static final int HOT_COMMENTS_THRESHOLD = 5;
    private static final int POPULAR_COMMENTS_THRESHOLD = 10;
    private static final int POPULAR_VIEWS_THRESHOLD = 50;

    /**
     * Computes badge: pinned (manual) > hot > new > popular.
     * Only "pinned" is stored in DB; others are computed from metrics.
     */
    public String computeBadge(Discussion d) {
        if ("pinned".equals(d.getBadge())) {
            return "pinned";
        }
        Instant now = Instant.now();
        Instant createdAt = d.getCreatedAt() != null ? d.getCreatedAt() : now;
        long hoursSinceCreation = Duration.between(createdAt, now).toHours();
        long daysSinceCreation = Duration.between(createdAt, now).toDays();
        int comments = d.getComments();
        int views = d.getViews();

        // Hot: high engagement + recent (comments >= 5 and created < 7 days ago)
        if (comments >= HOT_COMMENTS_THRESHOLD && daysSinceCreation < HOT_DAYS) {
            return "hot";
        }
        // New: created within last 48 hours
        if (hoursSinceCreation < NEW_HOURS) {
            return "new";
        }
        // Popular: high engagement (comments >= 10 or views >= 50)
        if (comments >= POPULAR_COMMENTS_THRESHOLD || views >= POPULAR_VIEWS_THRESHOLD) {
            return "popular";
        }
        return null;
    }

    /**
     * Applies computed badges to discussions (pinned stays manual).
     */
    public void applyBadges(List<Discussion> discussions) {
        for (Discussion d : discussions) {
            d.setBadge(computeBadge(d));
        }
    }

    /**
     * Sorts discussions: pinned first, then by createdAt desc.
     */
    public List<Discussion> sortWithPinnedFirst(List<Discussion> discussions) {
        return discussions.stream()
                .sorted(Comparator
                        .<Discussion>comparingInt(d -> "pinned".equals(d.getBadge()) ? 0 : 1)
                        .thenComparing(Discussion::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .toList();
    }
}
