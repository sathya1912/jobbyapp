import {Link} from 'react-router-dom'
import './index.css'

const AllJobItem = props => {
  const {jobsData} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobsData
  return (
    <Link to={`/jobs/${id}`}>
      <li>
        <div>
          <div>
            <img src={companyLogoUrl} alt="company logo" />
            <div>
              <h1>{title}</h1>
              <div>
                <p>{rating}</p>
              </div>
            </div>
          </div>
          <div>
            <div>
              <div>
                <p>{location}</p>
              </div>
              <div>
                <p>{employmentType}</p>
              </div>
            </div>
            <div>
              <p>{packagePerAnnum}</p>
            </div>
          </div>
        </div>
        <hr />
        <div>
          <h1>Description</h1>
          <p>{jobDescription}</p>
        </div>
      </li>
    </Link>
  )
}

export default AllJobItem
