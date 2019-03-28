exports.up = function(knex, Promise) {
    return knex.schema.createTable("students", function(tbl) {
        tbl.increments("student_id");
    
        tbl
          .text("name")
          .notNullable()
          .unique();
    
        tbl
          .integer("cohort_id")
          .unsigned()
          .references("cohorts.cohort_id")
          .onDelete("CASCADE")
          .onUpdate("CASCADE");
      });
    
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema
    .dropTableIfExists("students")
  };