import React from 'react';
import Sheet from './Sheet';
import SheetTools from './SheetTools';
class ShareSheet extends React.Component {
    render() {
        return (
            <div className="App">
                <SheetTools />
                <header className="App-header">
                    <Sheet />
                </header>
            </div>
        )
    }
}
export default ShareSheet