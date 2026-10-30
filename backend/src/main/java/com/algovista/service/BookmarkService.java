package com.algovista.service;

import com.algovista.dto.ApiDtos.QuestionSummary;
import com.algovista.entity.Bookmark;
import com.algovista.entity.Question;
import com.algovista.entity.UserAccount;
import com.algovista.repository.BookmarkRepository;
import com.algovista.repository.QuestionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class BookmarkService {
    private final BookmarkRepository bookmarks;
    private final QuestionRepository questions;
    private final CatalogService catalog;
    public BookmarkService(BookmarkRepository bookmarks, QuestionRepository questions, CatalogService catalog) {
        this.bookmarks = bookmarks; this.questions = questions; this.catalog = catalog;
    }
    @Transactional(readOnly = true)
    public List<QuestionSummary> list(UserAccount user) {
        return bookmarks.findAllByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(bookmark -> catalog.summary(bookmark.getQuestion(), user)).toList();
    }
    @Transactional
    public void add(UserAccount user, Long questionId) {
        Question question = questions.findById(questionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Question not found."));
        if (bookmarks.findByUserIdAndQuestionId(user.getId(), questionId).isEmpty()) {
            bookmarks.save(new Bookmark(user, question));
        }
    }
    @Transactional
    public void remove(UserAccount user, Long questionId) {
        bookmarks.findByUserIdAndQuestionId(user.getId(), questionId).ifPresent(bookmarks::delete);
    }
}
