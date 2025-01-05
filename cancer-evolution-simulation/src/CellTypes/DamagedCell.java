package CellTypes;

import java.util.Random;

import jade.core.Agent;

public class DamagedCell extends CellType{
	
	public DamagedCell(int generation, int geneticPredisposition) {
		super(generation, geneticPredisposition);
		
		setcellState(ECellState.Damaged);
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
        if(generation > 5 && randomNumber <= geneticPredisposition) 
           return ECellState.PreCancerous;
        return this.getcellState();
	}

	
}
