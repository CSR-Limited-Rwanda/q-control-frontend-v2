import React, { useState, useEffect } from 'react'

const PositionCard = ({ position, itemsToShow }) => {
    const [excessItems, setExcessItems] = useState(false);

    if (!position) return null;
    // if not position is not sting, return null
    if (typeof position !== 'string') return null;

    // if position is empty, return null
    if (position.trim() === '') return null;

    // split the position by comma, and return an array of positions
    const positionsArray = position.split(',').map(pos => pos.trim());
    if (positionsArray.length === 0) return null;

    // Use useEffect to handle the excessItems state update
    useEffect(() => {
        if (positionsArray.length > itemsToShow) {
            setExcessItems(true);
        } else {
            setExcessItems(false);
        }
    }, [positionsArray.length, itemsToShow]);
    return (
        <div className='positions'>{
            excessItems ? (
                <div className="more-positions">
                    {
                        positionsArray.map((pos, index) => (
                            <span key={index} className='position-item'>{pos}</span>
                        ))
                    }
                    + {positionsArray.length - itemsToShow} more
                </div>
            )
                : (
                    positionsArray.map((pos, index) => (
                        <span key={index} className='position-item'>{pos}</span>
                    ))
                )
        }</div>
    )
}

export default PositionCard