package com.digitalwallet;

import com.digitalwallet.util.Emails;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class EmailsTest {

    @Test
    void normalizeTrimsAndLowercases() {
        assertThat(Emails.normalize("  Alice@Example.COM ")).isEqualTo("alice@example.com");
    }

    @Test
    void equalsIgnoreCaseComparesNormalizedValues() {
        assertThat(Emails.equalsIgnoreCase("Bob@Test.com", " bob@test.com ")).isTrue();
        assertThat(Emails.equalsIgnoreCase("a@test.com", "b@test.com")).isFalse();
    }
}
