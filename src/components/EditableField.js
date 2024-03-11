import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

const EditableField = ({ fieldName, value, editingField, onEditClick,Name, onChange }) => {
  return (
    <div className="form-user-add-inner-wrap">
      <label>{fieldName}</label>
      {editingField === fieldName || editingField === "all" ? (
        <div className="edit-new-input">
          <input
            name={Name}
            defaultValue={value}
            onChange={onChange}
   
                  />
        </div>
      ) : (
        <div className="edit-new-input">
          {value}
          <FontAwesomeIcon icon={faPencil} onClick={() => onEditClick(fieldName)} />
        </div>
      )}
    </div>
  );
};

export default EditableField;
