package io.ssafy.gatee.domain.family.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.ssafy.gatee.config.security.CustomWithMockUser;
import io.ssafy.gatee.domain.family.application.FamilyService;
import io.ssafy.gatee.domain.family.dto.request.FamilyNameReq;
import io.ssafy.gatee.domain.family.dto.request.FamilySaveReq;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.restdocs.AutoConfigureRestDocs;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.jpa.mapping.JpaMetamodelMappingContext;
import org.springframework.http.MediaType;
import org.springframework.restdocs.mockmvc.MockMvcRestDocumentation;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;

import java.util.UUID;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles({"common, prod"})
@AutoConfigureRestDocs
@WebMvcTest(FamilyController.class)
@MockBean(JpaMetamodelMappingContext.class)
class FamilyControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private FamilyService familyService;

    @Test
    @CustomWithMockUser
    @DisplayName("가족 생성 테스트")
    void saveFamily() throws Exception {
        FamilySaveReq familySaveReq = FamilySaveReq.builder()
                .name("우리집")
                .build();

        String familySaveJson = objectMapper.writeValueAsString(familySaveReq);

        mockMvc.perform(post("/api/family")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(familySaveJson))
                .andDo(MockMvcResultHandlers.print())
                .andDo(MockMvcRestDocumentation.document("가족 생성"))
                .andExpect(status().isOk());
    }

    @Test
    @CustomWithMockUser
    @DisplayName("가족 코드 생성 테스트")
    void createFamilyCode() throws Exception {
        mockMvc.perform(get("/api/family/1/code"))
                .andDo(MockMvcResultHandlers.print())
                .andDo(MockMvcRestDocumentation.document("가족 코드 생성"))
                .andExpect(status().isOk());
    }

    @Test
    @CustomWithMockUser
    @DisplayName("가족 합류 테스트")
    void joinFamily() throws Exception {
        mockMvc.perform(post("/api/family/join")
                        .with(csrf())
                        .param("familyCode", "A1B2C3D4")
                        .param("memberId", String.valueOf(UUID.randomUUID())))
                .andDo(MockMvcResultHandlers.print())
                .andDo(MockMvcRestDocumentation.document("가족 합류"))
                .andExpect(status().isOk());
    }

    @Test
    @CustomWithMockUser
    @DisplayName("가족 정보 조회 테스트")
    void readFamily() throws Exception {
        mockMvc.perform(get("/api/family/1")
                        .with(csrf()))
                .andDo(MockMvcResultHandlers.print())
                .andDo(MockMvcRestDocumentation.document("가족 정보 조회"))
                .andExpect(status().isOk());
    }

    @Test
    @CustomWithMockUser
    @DisplayName("가족 이름 수정 테스트")
    void editFamilyName() throws Exception {
        FamilyNameReq familyNameReq = FamilyNameReq.builder()
                .name("우리집")
                .build();

        String editFamilyNameJson = objectMapper.writeValueAsString(familyNameReq);

        mockMvc.perform(patch("/api/family/1")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(editFamilyNameJson))
                .andDo(MockMvcResultHandlers.print())
                .andDo(MockMvcRestDocumentation.document("가족 이름 수정"))
                .andExpect(status().isOk());
    }
}