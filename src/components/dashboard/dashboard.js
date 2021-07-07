import css from './dashboard.module.css'
import {Event} from '../events/events'
import { useEffect, useState } from 'react'
import {Input, Button} from 'semantic-ui-react'

export default function Dashboard() {
    const [events, setEvents] = useState([])
    const [loggedIn, setLoggedIn] = useState(false)
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    })

    const readAllEvents = () => {
        let calendarContent = localStorage.getItem('calendar')
        if (!calendarContent) return

        let calendar = JSON.parse(calendarContent)
        let events = []
        for(let key in calendar) {
            events.push(...calendar[key].events)
        }

        setEvents(events)
    }

    useEffect(() => {
        if (loggedIn) readAllEvents()
    }, [loggedIn])

    const onLogin = (e) => {
        e.preventDefault()

        if (credentials.username === 'admin' && credentials.password === 'admin') {
            setLoggedIn(true)
        }

        setCredentials({
            username: '',
            password: ''
        })
    }

    const onInput = key => event => {
        setCredentials({
            ...credentials,
            [key]: event.target.value
        })
    }

    if (!loggedIn) {
        return (
            <div className={css.login}>
                <form className={css.loginBox} onSubmit={onLogin}>
                    <span>Login</span>

                    <Input placeholder='Username' onChange={onInput('username')}/>

                    <Input type='password' placeholder='Password' onChange={onInput('password')}/>

                    <Button type='submit' primary>Submit</Button>
                </form>
            </div>
        )
    }

    return (
        <div className={css.dashboard}>
            <span>Events</span>

            <div className={css.events}>
                { events.map(event => {
                    console.log(event.startDate)
                    return <Event
                        readOnly={true}
                        showPerson={true}
                        link={event.link}
                        place={event.place}
                        person={event.person}
                        endDate={event.endDate}
                        startDate={event.startDate}
                        title={event.title}
                        memo={event.memo} />
                })}
            </div>
        </div>
    )
}