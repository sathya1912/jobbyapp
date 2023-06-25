import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import AllJobItem from '../AllJobItem'
import Header from '../Header'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    profileData: {},
    jobsData: [],
    activeCheckBoxList: [],
    activeSalaryRangeId: '',
    searchInput: '',
    apiStatus: apiStatusConstants.initial,
    // eslint-disable-next-line react/no-unused-state
    apiJobStatus: apiStatusConstants.initial,
  }

  componentDidMount = () => {
    this.getProfileData()
    this.getJobsData()
  }

  getProfileData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const option = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, option)
    const data = await response.json()

    if (response.ok === true) {
      const profile = data.profile_details
      const updatedProfileData = {
        name: profile.name,
        profileImageUrl: profile.profile_image_url,
        shortBio: profile.short_bio,
      }

      this.setState({
        profileData: updatedProfileData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  getJobsData = async () => {
    this.setState({apiJobsStatus: apiStatusConstants.inProgress})
    const {activeCheckBoxList, activeSalaryRangeId, searchInput} = this.state
    const type = activeCheckBoxList.join(',')
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=${type}&minimum_package=${activeSalaryRangeId}&search=${searchInput}`
    const option = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, option)
    const data = await response.json()

    if (response.ok === true) {
      const filteredJobsList = data.jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        title: eachItem.title,
      }))
      this.setState({
        jobsData: filteredJobsList,
        apiJobsStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiJobsStatus: apiStatusConstants.failure})
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onSubmitSearchInput = () => {
    this.getJobsData()
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobsData()
    }
  }

  onSelectSalaryRange = event => {
    this.setState({activeSalaryRangeId: event.target.id}, this.getJobsData)
  }

  onClickCheckbox = event => {
    const {activeCheckBoxList} = this.state
    if (activeCheckBoxList.includes(event.target.id)) {
      const updatedList = activeCheckBoxList.filter(
        each => each !== event.target.id,
      )
      this.setState({activeCheckBoxList: updatedList}, this.getJobsData)
    } else {
      this.setState(
        prevState => ({
          // eslint-disable-next-line react/no-unused-state
          activeCheckboxList: [
            ...prevState.activeCheckBoxList,
            event.target.id,
          ],
        }),
        this.getJobsData,
      )
    }
  }

  onSuccessProfileView = () => {
    const {profileData} = this.state
    const {name, profileImageUrl, shortBio} = profileData
    return (
      <div>
        <img src={profileImageUrl} alt="profile" />
        <h1>{name}</h1>
        <p>{shortBio}</p>
      </div>
    )
  }

  onSuccessJobsView = () => {
    const {jobsData} = this.state
    const noOfJobs = jobsData.length > 0
    return noOfJobs ? (
      <>
        <ul>
          [
          {jobsData.map(eachItem => (
            <AllJobItem key={eachItem.id} item={eachItem} />
          ))}
          ]
        </ul>
      </>
    ) : (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1>No Jobs found</h1>
        <p>We could not find any jobs. Try other filters.</p>
      </div>
    )
  }

  onRetryProfile = () => {
    this.getProfileData()
  }

  onRetryJobs = () => {
    this.getJobsData()
  }

  onProfileFailView = () => (
    <>
      <button type="button" onClick={this.onRetryProfile}>
        Retry
      </button>
    </>
  )

  onGetJobsFailureView = () => (
    <>
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
        />
        <h1>Oops! Something went wrong</h1>
        <p>We cannot seem to find the page you are looking for</p>
        <div>
          <button type="button" onClick={this.onRetryJobs}>
            retry
          </button>
        </div>
      </div>
    </>
  )

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  onGetCheckBoxesView = () => (
    <ul>
      {employmentTypesList.map(eachItem => (
        <li key={eachItem.employmentTypeId}>
          <input
            id={eachItem.employmentTypeId}
            type="checkbox"
            onChange={this.onClickCheckbox}
          />
          <label htmlFor={eachItem.employmentTypeId}>{eachItem.label}</label>
        </li>
      ))}
    </ul>
  )

  onGetRadioButtonView = () => (
    <ul>
      {salaryRangesList.map(eachItem => (
        <li key={eachItem.salaryRangeId}>
          <input
            id={eachItem.salaryRangeId}
            type="radio"
            name="option"
            onChange={this.onSelectSalaryRange}
          />
          <label htmlFor={eachItem.salaryRangeId}>{eachItem.label}</label>
        </li>
      ))}
    </ul>
  )

  onRenderProfile = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.onProfileFailView()
      case apiStatusConstants.success:
        return this.onSuccessProfileView()
      default:
        return null
    }
  }

  onRenderJobs = () => {
    const {apiJobsStatus} = this.state
    switch (apiJobsStatus) {
      case apiStatusConstants.inPorgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.onGetJobsFailureView()
      case apiStatusConstants.success:
        return this.onSuccessJobsView()
      default:
        return null
    }
  }

  onRenderSearch = () => {
    const {searchInput} = this.state
    return (
      <>
        <input
          type="search"
          value={searchInput}
          placeholder="Search"
          onChange={this.onChangeSearchInput}
          onKeyDown={this.onEnterSearchInput}
        />
        <button
          data-testid="searchButton"
          type="button"
          onClick={this.onSubmitSearchInput}
        >
          hi
        </button>
      </>
    )
  }

  render() {
    return (
      <>
        <Header />
        <div>
          <div>{this.onRenderSearch()}</div>
          <div>
            {this.onRenderProfile()}
            <hr />
            <h1>Type of Employment</h1>
            {this.onGetCheckBoxesView()}
            <hr />
            <h1>Salary Range</h1>
            {this.onGetRadioButtonView()}
          </div>
          <div>
            <div>{this.onRenderSearch()}</div>
            {this.onRenderJobs()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
