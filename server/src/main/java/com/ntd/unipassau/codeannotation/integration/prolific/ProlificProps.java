package com.ntd.unipassau.codeannotation.integration.prolific;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProlificProps {
    private String completeCode;
}
