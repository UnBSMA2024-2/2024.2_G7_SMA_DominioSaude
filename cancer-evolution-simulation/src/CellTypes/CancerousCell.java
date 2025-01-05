package CellTypes;

import jade.core.Agent;

public class CancerousCell extends CellType {

	public CancerousCell(int generation, int geneticPredisposition) {
		super(generation, geneticPredisposition);
		setcellState(ECellState.Cancerous);
	}
	
	@Override
	public boolean repair(Agent a) {
		return false;
	}
	
	@Override 
	public ECellState russianRoulete() {
        return this.getcellState();
	}
	
	@Override
	public boolean apoptose(Agent a) {
        return false;
	}
}
