package CellTypes;

import java.util.Random;

import jade.core.Agent;

public abstract class CellType {
	protected ECellState cellState = ECellState.Normal;
	protected int repairCapability = 0;
	protected int geneticPredisposition = 10;
	protected int generation = 0;
	protected int apoptosePropetion = 1;
	
	public CellType(int generation,int geneticPredisposition) {
		this.generation = generation;
		this.geneticPredisposition = geneticPredisposition;
	}
	
	public boolean apoptose(Agent a) {
        final Random random = new Random();
        int randomNumber = random.nextInt(99) + 1;
        if (randomNumber <= apoptosePropetion) {
            System.out.println(a.getLocalName() + " realizou APOPTOSE!");
            a.doDelete();
            return true;
        }
        return false;
	}
	
	public void repair(Agent a){
        return;
	}
	
	// generation == 0
	public ECellState russianRoulete() {
        final Random random = new Random();
        int randomNumber = random.nextInt(99) + 1;
        System.out.println(generation + " "+ geneticPredisposition);
        if(generation > 5 && randomNumber <= geneticPredisposition) {
            System.out.println("Evoluiu");
            System.out.println("Evoluiu");
            System.out.println("Evoluiu");

            return ECellState.Damaged;
        }
        return cellState;
	}
	
	public ECellState getcellState() {
		return cellState;
	}
	
	public int getGeneticPredisposition() {
		return geneticPredisposition;
	}
	
	public int getGeneration() {
		return generation;
	}
	
	protected void setcellState(ECellState state) {
		cellState = state;
	}
	
	
}
