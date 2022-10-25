import React from 'react'
import TabLink from './TabLink'
import Westermann from './Westermann';
import Input from './Input';
import Klett from './Klett';
import CcBuchner from './CcBuchner';
import Cornelsen from './Cornelsen';

const tabs = {
    westermann: {
        name: "Westermann",
        component: <Westermann />,
        placeholder: "eyJ0eX..."
    },
    klett: {
        name: "Klett",
        component: <Klett />,
        placeholder: "229a08... MTU0OD..."
    },
    cornelsen: {
        name: "Cornelsen",
        component: <Cornelsen />,
        placeholder: "eyJraW..."
    },
    buchner: {
        name: "C.C. Buchner",
        component: <CcBuchner />,
        placeholder: "3DB6A7..."
    },
};

const Tabs = ({onTokenChange, onSubmit, onPublisherChange, publisher}) => {
    return (
        <div className='space-y-2'>
            <div className="w-full flex space-x-2">
                {
                    Object.entries(tabs).map(([key, tab]) => (
                        <TabLink text={tab.name} onClick={() => onPublisherChange(key)} active={publisher === key} key={key} />
                    ))
                }
            </div>
            { tabs[publisher].component }
            <Input placeholder={tabs[publisher].placeholder} onSubmit={onSubmit} onChange={onTokenChange}/>
        </div>
    )
}

export default Tabs
