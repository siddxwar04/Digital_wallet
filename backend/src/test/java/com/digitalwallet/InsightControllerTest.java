package com.digitalwallet;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class InsightControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser(username = "alice@test.com")
    void categorizeEndpointMatchesKnownKeyword() throws Exception {
        mockMvc.perform(post("/api/insights/categorize")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"description":"Swiggy order"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.description").value("Swiggy order"))
                .andExpect(jsonPath("$.category").value("FOOD"))
                .andExpect(jsonPath("$.source").value("KEYWORD"));
    }
}
