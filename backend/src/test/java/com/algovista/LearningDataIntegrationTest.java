package com.algovista;

import com.algovista.entity.Question;
import com.algovista.entity.Topic;
import com.algovista.repository.QuestionRepository;
import com.algovista.repository.TopicRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class LearningDataIntegrationTest {
    @Autowired private MockMvc mvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private TopicRepository topics;
    @Autowired private QuestionRepository questions;

    @Test
    void bookmarkAndCommentOwnershipPersistAcrossRequests() throws Exception {
        String suffix = Long.toString(System.nanoTime());
        Topic topic = topics.save(new Topic("Test Topic", "test-topic-" + suffix, "Test data only.", 99));
        Question question = questions.save(new Question("Test Question", "test-question-" + suffix, topic));
        MockHttpSession ownerSession = signup("owner-" + suffix + "@example.com");
        mvc.perform(get("/api/topics/" + topic.getSlug()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.questionCount").value(1));
        mvc.perform(get("/api/topics/" + topic.getSlug() + "/questions?search=Test&page=0&size=10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements").value(1))
                .andExpect(jsonPath("$.content[0].slug").value(question.getSlug()));

        mvc.perform(post("/api/bookmarks/" + question.getId()).session(ownerSession)
                        .with(SecurityMockMvcRequestPostProcessors.csrf()))
                .andExpect(status().isCreated());
        mvc.perform(post("/api/bookmarks/" + question.getId()).session(ownerSession)
                        .with(SecurityMockMvcRequestPostProcessors.csrf()))
                .andExpect(status().isCreated());
        mvc.perform(get("/api/bookmarks").session(ownerSession))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(question.getId()));
        mvc.perform(get("/api/users/me").session(ownerSession))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.bookmarkCount").value(1));

        MvcResult commentResult = mvc.perform(post("/api/questions/" + question.getId() + "/comments")
                        .session(ownerSession)
                        .with(SecurityMockMvcRequestPostProcessors.csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("content", "A persisted note."))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.content").value("A persisted note."))
                .andReturn();
        JsonNode comment = objectMapper.readTree(commentResult.getResponse().getContentAsString());
        long commentId = comment.get("id").asLong();
        MockHttpSession otherSession = signup("other-" + suffix + "@example.com");

        mvc.perform(put("/api/comments/" + commentId).session(otherSession)
                        .with(SecurityMockMvcRequestPostProcessors.csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("content", "Unauthorized edit."))))
                .andExpect(status().isForbidden());
        mvc.perform(delete("/api/comments/" + commentId).session(otherSession)
                        .with(SecurityMockMvcRequestPostProcessors.csrf()))
                .andExpect(status().isForbidden());
        mvc.perform(put("/api/comments/" + commentId).session(ownerSession)
                        .with(SecurityMockMvcRequestPostProcessors.csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("content", "Updated by owner."))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").value("Updated by owner."));
        mvc.perform(get("/api/questions/" + question.getId() + "/comments"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].content").value("Updated by owner."));
        mvc.perform(delete("/api/comments/" + commentId).session(ownerSession)
                        .with(SecurityMockMvcRequestPostProcessors.csrf()))
                .andExpect(status().isNoContent());
        mvc.perform(delete("/api/bookmarks/" + question.getId()).session(ownerSession)
                        .with(SecurityMockMvcRequestPostProcessors.csrf()))
                .andExpect(status().isNoContent());
        mvc.perform(get("/api/bookmarks").session(ownerSession))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    @Test
    void profileCanBeUpdatedOnlyThroughPermittedFields() throws Exception {
        MockHttpSession session = signup("profile-" + System.nanoTime() + "@example.com");
        mvc.perform(put("/api/users/me").session(session)
                        .with(SecurityMockMvcRequestPostProcessors.csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("fullName", "Updated Learner", "role", "ADMIN"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName").value("Updated Learner"));
        mvc.perform(get("/api/users/me").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName").value("Updated Learner"));
    }

    private MockHttpSession signup(String email) throws Exception {
        String request = objectMapper.writeValueAsString(Map.of(
                "fullName", "Integration Learner", "email", email, "password", "strong-test-password"));
        MvcResult result = mvc.perform(post("/api/auth/signup")
                        .with(SecurityMockMvcRequestPostProcessors.csrf())
                        .contentType(MediaType.APPLICATION_JSON).content(request))
                .andExpect(status().isCreated())
                .andReturn();
        MockHttpSession session = (MockHttpSession) result.getRequest().getSession(false);
        assertTrue(session != null, "Signup should establish an authenticated session.");
        return session;
    }
}
