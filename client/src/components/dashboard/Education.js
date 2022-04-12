import React from 'react';
import PropTypes from 'prop-types'
import { deleteEducation } from '../../actions/profile';
import { connect } from 'react-redux';
import formatDate from '../../utils/formatDate';

const Education = ({ education,deleteEducation }) => {
    function educations(){return education.map((edu) => (
    <tr key={edu._id}>
      <td>{edu.school}</td>
      <td className="hide-sm">{edu.degree}</td>
      <td>
      {formatDate(edu.from)} - {edu.to ? formatDate(edu.to) : 'Now'}
      </td>
      <td>
        <button
          className="btn btn-danger"
          onClick={()=>deleteEducation(edu._id)}
        >
          Delete
        </button>
      </td>
    </tr>
  ))
    }

  return (
    <div className='container'>
      <h2 className="my-2">Education Credentials</h2>
      <table className="table">
        <thead>
          <tr>
            <th>School</th>
            <th className="hide-sm">Degree</th>
            <th className="hide-sm">Years</th>
            <th />
          </tr>
        </thead>
        <tbody>{educations()}</tbody>
      </table>
    </div>
  );
};

Education.propTypes = {
  education: PropTypes.array.isRequired,
  deleteEducation: PropTypes.func.isRequired
};

export default connect(null,{ deleteEducation })(Education);