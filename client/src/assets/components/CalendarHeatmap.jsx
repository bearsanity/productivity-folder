

const CalendarHeatmap = ({ completionHistory }) => {
    const today = new Date();
    const days = [];

    for (let i = 27; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        days.push(date);
    }

    return (
        <div style={{ display: 'grid', gap: '2px', gridTemplateColumns: 'repeat(7, 18px)' }}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <div key={index} style={{ textAlign: 'center', fontSize: '10px' }}>{day}</div>
            ))}
            {days.map((day, index) => (
                <div key={index} style={{
                    width: '18px',
                    height: '18px',
                    backgroundColor: completionHistory.some(date =>
                        new Date(date).toDateString() === day.toDateString()
                    ) ? 'green' : 'gray',
                    borderRadius: '2px', 
                    opacity: day > today ? 0.3 : 1,
                }} title={day.toDateString()} />
            ))}
        </div>
    );
};

export default CalendarHeatmap
