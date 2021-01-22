import React from 'react';

export default function SearchHistoryList({notifications=[]}) {
    return (

        <div  className="my-3 p-3 bg-white rounded shadow-sm">
            <h6 className="border-bottom pb-2 mb-0">Notifications</h6>
            { 
                notifications.map((data) => {
                    if (data.name) {
                        return (
                                <div key={`N${data.name}:${data.price}`} className="d-flex text-muted pt-3">
                                    <div className="pb-3 mb-0 small lh-sm border-bottom w-100">
                                        <div className="d-flex justify-content-between">
                                        <strong className="text-gray-dark">{data.name}</strong>
                                        </div>
                                        <span className="d-block">{data.price}</span>
                                    </div>
                                </div>
                        )	
                    }
                    return null
                })
            }
        </div>
    )
}


