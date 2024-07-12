const { QueryTypes } = require("sequelize");
const db = require("../../../models");
const { createFunction_logError } = require("./logSP");
const {
  createTriggerFunction_trg_moderate_post_content_after_insert,
  createTrigger_createPost,
} = require("./post_Triggers");
const {
  createFunction_reverseRating,
  createTriggerFunction_updateAVG_Score,
  createTrigger_score,
} = require("./scores_triggers");

const {
  createTriggerFunction_trg_moderate_forum_content_after_insert,
  createTrigger_createForum,
} = require("./forum_triggers");

const {
  createTriggerFunction_trg_moderate_event_content,
  createTrigger_createEvent,
  sp_for_next_trigger,
  create_sp_for_trigger,
  createTriggerFunction_event_part_count,
  createTrigger_event_part_count,
} = require("./event_triggers");
const {
  createTriggerFunction_trg_content_validation,
  createTrigger_validateContent,
  createTriggerFunction_trg_update_content_admin_id,
  createTrigger_contentValidated,
} = require("./content_validation_triggers");

const {
  create_spEngagementMetrics,
  create_spGetContentValidationStatus,
  create_spGetContentValidationStatusByAdmin,
  create_spGetActiveDiscussions,
  create_view_content_validation_status,
  create_view_active_discussions,
  create_usersView,
  create_fn_is_city_valid,
  create_sp_get_users_by_city,
  create_vw_post_counts,
  create_sp_get_post_counts_by_city,
  create_vw_events,
  create_sp_get_events_by_city,
  create_vw_forum_discussions,
  create_sp_get_forum_discussions_by_city,
} = require("./dashbord");

const set_triggers = async () => {
  await createFunction_logError();
  await createFunction_reverseRating();
  await createTriggerFunction_updateAVG_Score();
  await createTrigger_score();
  await createTriggerFunction_trg_moderate_post_content_after_insert();
  await createTrigger_createPost();
  await createTriggerFunction_trg_moderate_forum_content_after_insert();
  await createTrigger_createForum();
  await createTriggerFunction_trg_moderate_event_content();
  await createTrigger_createEvent();
  await createTriggerFunction_trg_content_validation();
  await createTrigger_validateContent();
  await createTriggerFunction_trg_update_content_admin_id();
  await createTrigger_contentValidated();
  await sp_for_next_trigger();
  await create_sp_for_trigger();
  await createTriggerFunction_event_part_count();
  await createTrigger_event_part_count();

  //for dashboard
  await create_spEngagementMetrics();
  await create_spGetContentValidationStatusByAdmin();
  await create_spGetContentValidationStatus();
  await create_spGetActiveDiscussions();
  await create_view_content_validation_status();
  await create_view_active_discussions();
  await create_usersView();
  await create_fn_is_city_valid();
  await create_sp_get_users_by_city();
  await create_vw_post_counts();
  await create_sp_get_post_counts_by_city();
  await create_vw_events();
  await create_sp_get_events_by_city();
  await create_vw_forum_discussions();
  await create_sp_get_forum_discussions_by_city();
};
set_triggers();
