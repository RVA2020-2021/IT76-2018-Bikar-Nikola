package rva.ctrls;

import java.util.Collection;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import rva.jpa.Liga;
import rva.repository.LigaRepository;

@RestController
public class LigaRestController {
	
	@Autowired
	private LigaRepository ligaRepository;
	
	@Autowired
	private JdbcTemplate jdbcTemplate;

	@GetMapping("liga")
	public Collection<Liga> getLige() {
		return ligaRepository.findAll();
	}

	@GetMapping("liga/{id}")
	public Liga getLiga(@PathVariable ("id") Integer id) {
		return ligaRepository.getOne(id);
	}
	
	@GetMapping("ligaNaziv/{naziv}")
	public Collection<Liga> getLigaByNaziv(@PathVariable ("naziv") String naziv){
		return ligaRepository.findByNazivContainingIgnoreCase(naziv);
	}
	//insert
	@PostMapping("liga")
	public ResponseEntity<Liga> insertLiga(@RequestBody Liga liga){
		if(!ligaRepository.existsById(liga.getId())) {
			ligaRepository.save(liga);
			return new ResponseEntity<Liga>(HttpStatus.OK);
		}
		return new ResponseEntity<Liga>(HttpStatus.CONFLICT);
	}
	//update
	@PutMapping("liga")
	public ResponseEntity<Liga> updateLiga(@RequestBody Liga liga) {
		if(!ligaRepository.existsById(liga.getId())) {
			return new ResponseEntity<Liga>(HttpStatus.NO_CONTENT);
		}
		ligaRepository.save(liga);
		return new ResponseEntity<Liga>(HttpStatus.OK);
	}
	//delete
	
	@Transactional
	@DeleteMapping("liga/{id}")
	public ResponseEntity<Liga> deleteIgrac(@PathVariable("id") Integer id){
		if(!ligaRepository.existsById(id))
			return new ResponseEntity<Liga>(HttpStatus.NO_CONTENT);
		
		jdbcTemplate.execute("DELETE FROM tim WHERE liga=" + id);
		
		ligaRepository.deleteById(id);
		if(id == -100)
			jdbcTemplate.execute("INSERT INTO \"liga\" (\"id\", \"naziv\", \"oznaka\") "
				+ "VALUES (-100, 'TestLigga', 'TST')");
		return new ResponseEntity<Liga>(HttpStatus.OK);
	}
}
