exports.seed = function(knex, Promise) {
  return knex("students")
    .truncate()
    .then(function() {
      return knex("students").insert([
        { name: "Student1", cohort_id: 1 },
        { name: "Studen2", cohort_id: 2 },
        { name: "Studen3", cohort_id: 3 },
        { name: "Studen4", cohort_id: 1 },
        { name: "Studen5", cohort_id: 2 },
        { name: "Studen6", cohort_id: 3 },
        { name: "Studen7", cohort_id: 1 },
      ]);
    });
};