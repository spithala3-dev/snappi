import React, { useState } from 'react';
import { Request, RequestType } from '../../types';
import { RequestCard } from './RequestCard';
import { RequestDetailModal } from './RequestDetailModal';

interface RequestListProps {
  requests: Request[];
  requestType: RequestType;
}

export const RequestList: React.FC<RequestListProps> = ({ requests, requestType }) => {
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  const openRequests = requests.filter(r => r.status === 'open');
  const myRequests = requests.filter(r =>
    r.status !== 'open' &&
    (r.requesterId === JSON.parse(localStorage.getItem('snappi_user') || '{}').id ||
     r.helperId === JSON.parse(localStorage.getItem('snappi_user') || '{}').id)
  );

  return (
    <>
      <div className="space-y-6">
        {openRequests.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Open Requests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {openRequests.map(request => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onClick={() => setSelectedRequest(request)}
                />
              ))}
            </div>
          </div>
        )}

        {myRequests.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">My Requests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myRequests.map(request => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onClick={() => setSelectedRequest(request)}
                />
              ))}
            </div>
          </div>
        )}

        {openRequests.length === 0 && myRequests.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <p className="text-gray-500 text-lg">No requests available</p>
            <p className="text-gray-400 mt-2">Be the first to create one!</p>
          </div>
        )}
      </div>

      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </>
  );
};
