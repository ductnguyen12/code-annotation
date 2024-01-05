-- jobrunr_backgroundjobservers definition

-- Drop table

-- DROP TABLE jobrunr_backgroundjobservers;

CREATE TABLE IF NOT EXISTS jobrunr_backgroundjobservers
(
    id                         bpchar(36) NOT NULL,
    workerpoolsize             int4          NOT NULL,
    pollintervalinseconds      int4          NOT NULL,
    firstheartbeat             timestamp(6)  NOT NULL,
    lastheartbeat              timestamp(6)  NOT NULL,
    running                    int4          NOT NULL,
    systemtotalmemory          int8          NOT NULL,
    systemfreememory           int8          NOT NULL,
    systemcpuload              numeric(3, 2) NOT NULL,
    processmaxmemory           int8          NOT NULL,
    processfreememory          int8          NOT NULL,
    processallocatedmemory     int8          NOT NULL,
    processcpuload             numeric(3, 2) NOT NULL,
    deletesucceededjobsafter   varchar(32) NULL,
    permanentlydeletejobsafter varchar(32) NULL,
    "name"                     varchar(128) NULL,
    CONSTRAINT jobrunr_backgroundjobservers_pkey PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS jobrunr_bgjobsrvrs_fsthb_idx ON jobrunr_backgroundjobservers USING btree (firstheartbeat);
CREATE INDEX IF NOT EXISTS jobrunr_bgjobsrvrs_lsthb_idx ON jobrunr_backgroundjobservers USING btree (lastheartbeat);


-- jobrunr_jobs definition

-- Drop table

-- DROP TABLE jobrunr_jobs;

CREATE TABLE IF NOT EXISTS jobrunr_jobs
(
    id             bpchar(36) NOT NULL,
    "version"      int4         NOT NULL,
    jobasjson      text         NOT NULL,
    jobsignature   varchar(512) NOT NULL,
    state          varchar(36)  NOT NULL,
    createdat      timestamp    NOT NULL,
    updatedat      timestamp    NOT NULL,
    scheduledat    timestamp NULL,
    recurringjobid varchar(128) NULL,
    CONSTRAINT jobrunr_jobs_pkey PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS jobrunr_job_created_at_idx ON jobrunr_jobs USING btree (createdat);
CREATE INDEX IF NOT EXISTS jobrunr_job_rci_idx ON jobrunr_jobs USING btree (recurringjobid);
CREATE INDEX IF NOT EXISTS jobrunr_job_scheduled_at_idx ON jobrunr_jobs USING btree (scheduledat);
CREATE INDEX IF NOT EXISTS jobrunr_job_signature_idx ON jobrunr_jobs USING btree (jobsignature);
CREATE INDEX IF NOT EXISTS jobrunr_jobs_state_updated_idx ON jobrunr_jobs USING btree (state, updatedat);
CREATE INDEX IF NOT EXISTS jobrunr_state_idx ON jobrunr_jobs USING btree (state);


-- jobrunr_metadata definition

-- Drop table

-- DROP TABLE jobrunr_metadata;

CREATE TABLE IF NOT EXISTS jobrunr_metadata
(
    id        varchar(156) NOT NULL,
    "name"    varchar(92)  NOT NULL,
    "owner"   varchar(64)  NOT NULL,
    value     text         NOT NULL,
    createdat timestamp    NOT NULL,
    updatedat timestamp    NOT NULL,
    CONSTRAINT jobrunr_metadata_pkey PRIMARY KEY (id)
);


-- jobrunr_migrations definition

-- Drop table

-- DROP TABLE jobrunr_migrations;

CREATE TABLE IF NOT EXISTS jobrunr_migrations
(
    id          bpchar(36) NOT NULL,
    script      varchar(64) NOT NULL,
    installedon varchar(29) NOT NULL,
    CONSTRAINT jobrunr_migrations_pkey PRIMARY KEY (id)
);


-- jobrunr_recurring_jobs definition

-- Drop table

-- DROP TABLE jobrunr_recurring_jobs;

CREATE TABLE IF NOT EXISTS jobrunr_recurring_jobs
(
    id        bpchar(128) NOT NULL,
    "version" int4 NOT NULL,
    jobasjson text NOT NULL,
    createdat int8 NOT NULL DEFAULT '0'::bigint,
    CONSTRAINT jobrunr_recurring_jobs_pkey PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS jobrunr_recurring_job_created_at_idx ON jobrunr_recurring_jobs USING btree (createdat);