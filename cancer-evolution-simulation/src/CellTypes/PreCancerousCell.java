package CellTypes;

import java.util.Random;

import jade.core.Agent;

public class PreCancerousCell extends CellType {

	public PreCancerousCell(int generation, int geneticPredisposition) {
		super(generation, geneticPredisposition);
		setcellState(ECellState.PreCancerous);
	}
	
	@Override
	public boolean repair(Agent a) {
		final Random random = new Random();
		int randomNumber = random.nextInt(99) + 1;
		if (randomNumber <= repairCapability) {
			setcellState(ECellState.Normal);
			System.out.println(a.getLocalName() + " realizou REPARO!");
			
			return true;
		}
		
		return false;
	}
	
	@Override 
	public ECellState russianRoulete() {
        final Random random = new Random();
        int randomNumber = random.nextInt(99) + 1;
        if(generation > 10 && randomNumber <= geneticPredisposition / 2)
        	return ECellState.Cancerous;
        return this.getcellState();
	}


}
