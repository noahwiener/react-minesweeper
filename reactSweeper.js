/* global React */
/* global Minesweeper */

var Tile = React.createClass({
  handleClick: function(event) {
    var pos = this.props.position;
    var altKey = event.altKey;
    this.props.UpdateGame(pos, altKey);
  },
  render: function() {
    var tileClass = "";
    var text, klass;
    var square = this.props.tile;
    if (square.explored && square.bombed){
      klass = 'bombed';
      text = "\u2622";
    } else if (square.explored){
      klass = 'explored';
      if (square.adjacentBombCount() === 0){
        text = "";
      } else {
        text = square.adjacentBombCount();
      }
    } else if (square.flagged){
      klass = 'flagged';
      text = "\u2691";
    }
    klass = klass + ' square';

    return (<div onClick={this.handleClick} className={klass}>{text}</div>);
  }
});

var Board = React.createClass({
  render: function() {
    return (<div>{
      this.props.board.map(function(row, rowIdx) {
        return (<div className={'row'} key={rowIdx}>
          {row.map(function(tile, colIdx){
            return (<Tile key={colIdx}
                         tile={tile}
                         position={[rowIdx, colIdx]}
                         UpdateGame={this.props.UpdateGame} />);
          }.bind(this))}
          </div>);
      }.bind(this))
      }</div>
    );
  }
});

var Modal = React.createClass ({
  render: function(){
    var active = "",
      displayClass = 'modal-content modal ',
      containerClass = 'modal modal-screen ';
    if (this.props.active){
      active = "active";
    }
      displayClass = displayClass + active;
      containerClass = containerClass + active;
      debugger;
      return (<div className={containerClass}>
      <div className={displayClass}>
              {this.props.content}
              <button onClick={this.props.clickHandler}>{"Start a new game"}</button>
            </div>
        </div>);
  }
});

var Game = React.createClass ({
  getInitialState: function(){
    return (
      { board: new Minesweeper.Board(10, 10),
        lost: false,
        won: false
      });
  },

  UpdateGame: function(pos, altKey){
    var row = pos[0];
    var col = pos[1];
    var selectedTile = this.state.board.grid[row][col];
    if(altKey) {
      selectedTile.toggleFlag();
    } else {
      selectedTile.explore();
    }
    this.setState({ won: this.state.board.won(), lost: this.state.board.lost()});
  },

  restartGame: function (){
    this.setState({ board: new Minesweeper.Board(10, 10),
      lost: false,
      won: false
    });
  },

  render: function(){
    var content = "";
    var active = false;

    if (this.state.lost){
      content = 'You lost';
      active = true;
    }else if (this.state.won){
      content = 'You win!';
      active = true;
    }
    return (<div>
              <Modal content={content} active={active} clickHandler={this.restartGame} />
              <Board board={this.state.board} UpdateGame={this.UpdateGame} />
            </div>);
  }
});

React.render(<Game />, document.getElementById('minesweeper'));
