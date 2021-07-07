import css from './events.module.css'
import {Icon} from 'semantic-ui-react'
import { useAppContext } from '../../App'
import React, { useEffect } from 'react'
import dayjs from 'dayjs'
import _strings from './strings.js'

export default function Events() {
    const {state: {events, locale}, setEventViewVisibility, eventPopup} = useAppContext()
    const strings = _strings[locale]

    useEffect(() => {
        let escapeListener = e => {
            if (e.keyCode === 27) 
                setEventViewVisibility(false)
        }

        window.addEventListener('keydown', escapeListener)

        return () => {
            window.removeEventListener('keydown', escapeListener)
        }

        // eslint-disable-next-line
    }, [])

    return (
        <div className={css.events}>
            <div className={css.title}>
                <span>{strings.events}</span>
                <Icon name='close' color='grey' onClick={_ => setEventViewVisibility(false)} />
            </div>
            { events.map((event, i) => {
                const onUpdate = () => {
                    eventPopup.open('update', null, {
                        ...event
                    })
                }

                return (
                    <Event
                        onUpdate={onUpdate}
                        key={i}
                        showPerson={false} 
                        link={event.link}
                        place={event.place}
                        person={event.person}
                        endDate={event.endDate}
                        startDate={event.startDate}
                        title={event.title}
                        memo={event.memo} />
                    )
            }) }
        </div>
    )
}

export function Event({ readOnly = false, title, showPerson, person, memo, startDate, endDate, place, link, onUpdate = () => {}}) {
    let dateTime = dayjs(startDate).format('MMM D YYYY ⋅ hh:mma - ') + dayjs(endDate).format('hh:mma')

    return (
        <div className={css.event}>
            { !readOnly && <Icon name='edit' className={css.editEvent} color='blue' onClick={onUpdate} /> }
            <Icon name='sticky note' />
            <div className={css.eventDateAndTime} >
                <span>{title}</span>
                <span>{dateTime}</span>
            </div>
            {
                showPerson && <React.Fragment>
                    <Icon name='user' />
                    <span>{person}</span>
                </React.Fragment>
            }
            <Icon name='map marker' />
            <span>{place}</span>
            <Icon name='file alternate' />
            <span>{memo}</span>
            {
                !!link && <React.Fragment>
                    <Icon name='linkify' />
                    <a href={link}>{link}</a>
                </React.Fragment>
            }
        </div>
    )
}