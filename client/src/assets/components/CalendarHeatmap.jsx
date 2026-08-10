

const CalendarHeatmap = ({ completionHistory }) => {
    const today = new Date();
    const days = [];

    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        days.push(date);
    }

    return (
        <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap' }}>
            {days.map((day, index) => (
                <div key={index} style={{
                    width: '14px',
                    height: '14px',
                    backgroundColor: completionHistory.some(date =>
                        new Date(date).toDateString() === day.toDateString()
                    ) ? 'green' : 'gray',
                    borderRadius: '2px'
                }} />
            ))}
        </div>
    );
};

export default CalendarHeatmap
