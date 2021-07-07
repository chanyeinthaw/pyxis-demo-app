import clsx from 'clsx'
import { useAppContext } from '../../App'
import css from './event-popup.module.css'
import {Icon, Input, Button} from 'semantic-ui-react'
import {
    DateInput, TimeInput
  } from 'semantic-ui-calendar-react';
import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { generateUniqueId } from '../../lib/generate-uuid';

export default function EventPopup({onSave, onDelete}) {
    const { 
        state,
        eventPopup,
        setEventPopupDay
    } = useAppContext()

    const eventPopupData = state.eventPopup.data
    const [startTime, setStartTime] = useState( !!eventPopupData.startDate ? dayjs(eventPopupData.startDate).format('HH:mm'): dayjs().format('HH:mm'))
    const [endTime, setEndTime] = useState( !!eventPopupData.endDate ? dayjs(eventPopupData.endDate).format('HH:mm'): dayjs().add(1, 'hour').format('HH:mm') )

    const disabled = useMemo(() => {
        let keys = Object.keys(state.eventPopup.data)
        for(let key of keys) {
            if (key === 'id') continue;
            if (state.eventPopup.data[key] === '') {
                console.log(key, state.eventPopup.data[key])
                return true
            }
        }
        return false
    }, [state.eventPopup.data])

    const onDateChange = (e, {name, value}) => {
        if (name === 'date') {
            return setEventPopupDay(value)
        } 

        const parsedDateTime = dayjs(`${state.eventPopup.day} ${value}`, 'YYYY-MM-DD HH:mm').format()

        if (name === 'startTime') {
            setStartTime(value)
            eventPopup.setData({
                startDate: parsedDateTime
            })
        } else {
            setEndTime(value)
            eventPopup.setData({
                endDate: parsedDateTime
            })
        }
    }

    const onInputChange = key => event => {
        eventPopup.setData({
            [key]: event.target.value
        })
    }

    const classes = clsx(css.backdrop, {
        [css.hidden]: !eventPopup.visible
    })

    const onDataSave = () => {
        onSave(state.eventPopup.mode, {
            ...state.eventPopup.data,
            userId: generateUniqueId()
        })
    }

    const _onDelete = () => {
        onDelete(eventPopupData.id, dayjs(eventPopupData.startDate).format('YYYY-MM-DD'))
    }

    const title = eventPopup.mode === 'create' ? 'Create event' : 'Update event'

    return (
        <div className={classes} onClick={_ => eventPopup.close()}>
            <div className={css.popup} onClick={e => e.stopPropagation()}>
                { state.eventPopup.mode === 'update' && 
                    <Icon name='trash' color='red' className={css.deleteIcon} onClick={_ => _onDelete()} /> }
                <span className={css.title} >{title}</span>

                <div className={css.input}>
                    <span>Title</span>
                    <Input value={eventPopupData.title} placeholder='Event title' onChange={onInputChange('title')} />
                </div>

                <div className={css.input}>
                    <span>Date</span>
                    <div className={css.dtGrid}>
                        <DateInput
                            value={state.eventPopup.day || dayjs(eventPopupData.startDate).format('YYYY-MM-DD')}
                            closable={true}
                            minDate={new Date()}
                            dateFormat='YYYY-MM-DD'
                            onChange={onDateChange}
                            className={css.date}
                            name="date"
                            placeholder="Date of the event"
                            iconPosition="right" />
                         { !!state.eventPopup.day && <TimeInput
                            value={startTime}
                            closable={true}
                            className={clsx(css.time1, css.time)}
                            name="startTime"
                            onChange={onDateChange}
                            placeholder="From"
                            iconPosition="right" /> }
                        { !!state.eventPopup.day && <TimeInput
                            value={endTime}
                            closable={true}
                            className={clsx(css.time2, css.time)}
                            name="endTime"
                            onChange={onDateChange}
                            placeholder="To"
                            iconPosition="right" /> }
                    </div>
                </div>

                <div className={css.input}>
                    <span>Name</span>
                    <Input value={eventPopupData.person} placeholder='Your name' onChange={onInputChange('person')} />
                </div>

                <div className={css.input}>
                    <span>Place</span>
                    <Input value={eventPopupData.place} placeholder='Place of the event' onChange={onInputChange('place')} />
                </div>

                <div className={css.input}>
                    <span>Link</span>
                    <Input value={eventPopupData.link} placeholder='Link to the event' onChange={onInputChange('link')} />
                </div>

                <div className={css.input}>
                    <span>Memo</span>
                    <Input value={eventPopupData.memo} placeholder='Description of the event' onChange={onInputChange('memo')} />
                </div>

                <Button onClick={onDataSave} primary className={css.button} disabled={disabled} >Save</Button>
            </div>
        </div>
    )
}