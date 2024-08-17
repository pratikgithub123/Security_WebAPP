import { DatePicker, Table, notification } from 'antd';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { getAuditLogs } from '../apis/Api';

const { RangePicker } = DatePicker;

const AuditDashboard = () => {
    const [auditLogs, setAuditLogs] = useState([]);
    const [userId, setUserId] = useState('');
    const [actionType, setActionType] = useState('');
    const [dates, setDates] = useState([]);

    const fetchLogs = useCallback(async () => {
        const queryParams = {
            userId,
            actionType,
            startDate: dates[0]?.format('YYYY-MM-DD'),
            endDate: dates[1]?.format('YYYY-MM-DD'),
        };

        try {
            const data = await getAuditLogs(queryParams);

            if (data.success && Array.isArray(data.auditLogs)) {
                // Deduplicate logs
                const uniqueLogs = data.auditLogs.reduce((acc, log) => {
                    const key = `${log.userId}-${log.actionType}-${log.timestamp}`;
                    if (!acc.keys.has(key)) {
                        acc.keys.add(key);
                        acc.result.push(log);
                    }
                    return acc;
                }, { keys: new Set(), result: [] }).result;

                setAuditLogs(uniqueLogs);
            } else {
                setAuditLogs([]);
            }
        } catch (error) {
            console.error('Error fetching audit logs:', error);
            notification.error({
                message: 'Error',
                description: 'Failed to fetch audit logs. Please try again later.',
            });
            setAuditLogs([]);
        }
    }, [userId, actionType, dates]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]); 

    const columns = [
        {
            title: 'User ID',
            dataIndex: 'userId',
            key: 'userId',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Full Name',
            dataIndex: 'fullname',
            key: 'fullname',
        },
        {
            title: 'Action Type',
            dataIndex: 'actionType',
            key: 'actionType',
        },
        {
            title: 'Details',
            dataIndex: 'details',
            key: 'details',
        },
        
        {
            title: 'Timestamp',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
        },
    ];

    return (
        <div>
            <h1>Audit Dashboard</h1>
            
            <Table
                columns={columns}
                dataSource={auditLogs}
                rowKey={(record) => `${record.userId}-${record.actionType}-${record.timestamp}`}
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
};

export default AuditDashboard;
