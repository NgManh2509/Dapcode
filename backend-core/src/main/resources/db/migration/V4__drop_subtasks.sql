-- Flyway Migration V4: Drop subtasks and subtask results
DROP TABLE IF EXISTS submission_subtask_results CASCADE;

ALTER TABLE test_cases DROP COLUMN IF EXISTS sub_task_id;

DROP TABLE IF EXISTS sub_tasks CASCADE;
