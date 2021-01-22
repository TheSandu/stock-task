import React from 'react';

export default function SearchHistoryList({historyList=[]}) {
    return (
        <ul className="list-group mb-3">
            { 
                historyList.map((data) => {
                    if (data.name) {
                        return (
                            <li key={`${data.name}:${data.price}`} className="list-group-item d-flex justify-content-between lh-sm">
                                <div>
                                    <h6 className="my-0">{ data.name }</h6>
                                </div>
                                <span className="text-muted">{ data.price }</span>
                            </li>
                        )	
                    }
                    return null
                })
            }
        </ul>
    )
}