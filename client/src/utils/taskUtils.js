export const isCompletedForPeriod = (frequency, completionHistory) => { 
    if (!completionHistory || completionHistory.length === 0) {
        return false
    }

    const now = new Date();

    return completionHistory.some(date => {
        const completed = new Date(date);

        switch (frequency) {
            case 'daily':
                return completed.toDateString() === now.toDateString();
            
            case 'weekly':
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay());
                startOfWeek.setHours(0, 0, 0, 0);
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6);
                endOfWeek.setHours(23, 59, 59, 999);
                return completed >= startOfWeek && completed <= endOfWeek;

            case 'monthly':
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                endOfMonth.setHours(23, 59, 59, 999);
                return completed >= startOfMonth && completed <= endOfMonth;

            case 'yearly':
                const startOfYear = new Date(now.getFullYear(), 0, 1);
                const endOfYear = new Date(now.getFullYear(), 11, 31);
                endOfYear.setHours(23, 59, 59, 999);
                return completed >= startOfYear && completed <= endOfYear;

            default:
                return false;
        }
    })
}