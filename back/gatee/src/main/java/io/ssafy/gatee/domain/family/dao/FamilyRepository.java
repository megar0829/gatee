package io.ssafy.gatee.domain.family.dao;

import io.ssafy.gatee.domain.family.entity.Family;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FamilyRepository extends JpaRepository<Family, UUID> {
}
