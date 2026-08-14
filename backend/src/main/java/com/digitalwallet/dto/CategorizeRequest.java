package com.digitalwallet.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CategorizeRequest {

    @NotBlank(message = "Description is required")
    @Size(max = 200, message = "Description must be 200 characters or fewer")
    private String description;

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
